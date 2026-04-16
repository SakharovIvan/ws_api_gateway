import { Injectable } from '@nestjs/common';
import { CatalogueService } from 'src/catalogue/catalogue.service';
import { ChatService } from 'src/chat/chat.service';
import { FileStorageService } from 'src/file_storage/file_storage.service';
import { WsCoreService } from 'src/ws_core/ws_core.service';

@Injectable()
export class SeedsService {
    constructor(
        private readonly fileService: FileStorageService,
        private readonly CatalogueService: CatalogueService,
        private readonly ChatService: ChatService,
        private readonly WsCoreService: WsCoreService
    ) { }
    async sync_services() {
        try {
            const ws = await this.WsCoreService.get_repair_list({ repair: { visible: true } })
            const repair_promises = ws.map(async (el) => {
                await this.fileService.create_bucket({ name: el.id })
                await this.ChatService.createChat({ path: el.id })
            })
            await Promise.all(repair_promises)
            const catalogue = await this.CatalogueService.get_Products('')
            if (catalogue) {
                const promises = catalogue.map(async (el) => {
                    await this.fileService.create_bucket({ name: el.id })
                    await this.ChatService.createChat({ path: el.id })
                })
                await Promise.all(promises)

            }
        } catch (error) {

        }
    }
}
