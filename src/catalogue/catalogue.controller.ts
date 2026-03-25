import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CATALOGUE_ROUTES } from 'lib/WS_types/catalogue/routes';
import { CatalogueService } from './catalogue.service';
import { Mat_No_Analog, Material_No } from 'lib/WS_types/catalogue/Mat_No';
import {
  type Product,
  Product_Mat_No,
  Product_Type,
  type Product_update,
  Product_update_result,
  Product_Work,
  Scheme_data,
} from 'lib/WS_types/catalogue/Product';
import { Work } from 'lib/WS_types/catalogue/Work';

@Controller(CATALOGUE_ROUTES.MAIN)
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Post(CATALOGUE_ROUTES.MATERIAL)
  material_upsert(@Body() data: Partial<Material_No>[]): Promise<void> {
    return this.catalogueService.material_upsert(data);
  }
  @Get(CATALOGUE_ROUTES.MATERIAL)
  get_material(
    @Query() query: { data: Partial<Material_No>; search?: string },
  ): Promise<Material_No | Material_No[]> {
    if (query.search !== undefined && !query.data) {
      return this.catalogueService.search_material(query.search);
    }
    return this.catalogueService.get_material(query.data);
  }

  @Get(CATALOGUE_ROUTES.ANALOGUE + '/:id')
  get_analogue(
    @Param('id') data: Partial<Material_No>,
  ): Promise<Mat_No_Analog[] | []> {
    return this.catalogueService.get_analogue(data);
  }

  @Post(CATALOGUE_ROUTES.ANALOGUE)
  analogue_full_update(@Body() data: Partial<Mat_No_Analog>): Promise<void> {
    return this.catalogueService.analogue_full_update(data);
  }

  @Post(CATALOGUE_ROUTES.ANALOGUE + '/upsert')
  analogue_upsert(@Body() data: Partial<Mat_No_Analog>): Promise<void> {
    return this.catalogueService.analogue_full_update(data);
  }
  @Post(CATALOGUE_ROUTES.MATERIAL + CATALOGUE_ROUTES.PRODUCT_TYPE)
  set_sp_mat_no_as_product(
    @Body() data: Partial<Material_No>[],
  ): Promise<void> {
    return this.catalogueService.set_sp_mat_no_as_product(data);
  }

  @Post(CATALOGUE_ROUTES.PRODUCT_TYPE)
  upsert_product_types(@Body() data: Partial<Product_Type>[]): Promise<void> {
    return this.catalogueService.upsert_product_types(data);
  }

  @Delete(CATALOGUE_ROUTES.PRODUCT_TYPE)
  delete_product_types(
    @Body() data: Pick<Product_Type, 'code'>[],
  ): Promise<void> {
    return this.catalogueService.delete_product_types(data);
  }

  @Get(CATALOGUE_ROUTES.PRODUCT_TYPE)
  get_product_types(): Promise<Product_Type[]> {
    return this.catalogueService.get_product_types();
  }

  @Patch(CATALOGUE_ROUTES.PRODUCT)
  set_Product_data(
    @Body() data: Product_update,
  ): Promise<Pick<Product_update_result, 'error_List'>> {
    return this.catalogueService.set_Product_data(data);
  }

  @Get(CATALOGUE_ROUTES.PRODUCT + CATALOGUE_ROUTES.SEARCH)
  get_Products_list(
    @Query() search: { query: string },
  ): Promise<Product[] | []> {
    return this.catalogueService.get_Products(search.query);
  }

  @Get(CATALOGUE_ROUTES.SCHEME)
  get_Scheme_data(@Query() query: Product): Promise<Scheme_data | []> {
    return this.catalogueService.get_Scheme_data(query);
  }

  @Get(CATALOGUE_ROUTES.PRODUCT_MAT_NO)
  get_Product_Mat_nos(@Query() query: Product): Promise<Product_Mat_No[] | []> {
    return this.catalogueService.get_Product_Mat_nos(query);
  }

  @Get(CATALOGUE_ROUTES.PRODUCT)
  get_Product_Works(@Query() data: Product): Promise<Product_Work[] | []> {
    return this.catalogueService.get_Product_Works(data);
  }

  @Post(CATALOGUE_ROUTES.WORK)
  work_full_update(@Body() data: Partial<Work>[]): Promise<void> {
    return this.catalogueService.work_full_update(data);
  }

  @Get(CATALOGUE_ROUTES.WORK + CATALOGUE_ROUTES.SEARCH)
  work_search(@Query() query: string): Promise<Work[] | []> {
    return this.catalogueService.work_search(query);
  }

  @Get(CATALOGUE_ROUTES.WORK + ':id')
  work_get(@Param('id') data: Partial<Work>): Promise<Work> {
    return this.catalogueService.work_get(data);
  }

  @Patch(CATALOGUE_ROUTES.WORK)
  work_part_update(@Body() data: Partial<Work>): Promise<void> {
    return this.catalogueService.work_part_update(data);
  }
}
