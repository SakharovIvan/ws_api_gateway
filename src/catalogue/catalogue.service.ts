import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CATALOGUE,
  CRUD,
  type Catalogue_ClientProxy,
  material_commands,
  product_commands,
  work_commands,
} from 'lib/WS_types/catalogue/CMDs';
import { Mat_No_Analog, Material_No } from 'lib/WS_types/catalogue/Mat_No';
import {
  Product,
  Product_Mat_No,
  Product_Type,
  Product_update,
  Product_update_result,
  Product_Work,
  Scheme_data,
} from 'lib/WS_types/catalogue/Product';
import { Work } from 'lib/WS_types/catalogue/Work';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CatalogueService
  implements
    Partial<material_commands>,
    Partial<product_commands>,
    Partial<work_commands>
{
  constructor(
    @Inject('CATALOGUE_SERVICE')
    private readonly coreService: Catalogue_ClientProxy,
  ) {}

  private async command(
    cmd: { catalogue: CATALOGUE | string; crud: CRUD },
    data: unknown = '',
  ): Promise<any> {
    const res = await lastValueFrom(this.coreService.send(cmd, data)).catch(
      (err) => {
        throw new HttpException(err.message, err.status | 400);
      },
    );
    return res;
  }

  search_material(data: string): Promise<Material_No[]> {
    return this.command(
      { catalogue: CATALOGUE.MATERIAL, crud: CRUD.SEARCH },
      data,
    );
  }
  get_material(data: Partial<Material_No>): Promise<Material_No> {
    return this.command(
      { catalogue: CATALOGUE.MATERIAL, crud: CRUD.GET },
      data,
    );
  }
  material_upsert(data: Partial<Material_No>[]): Promise<void> {
    return this.command(
      { catalogue: CATALOGUE.MATERIAL, crud: CRUD.UPSERT },
      data,
    );
  }
  analogue_upsert(data: Partial<Mat_No_Analog>): Promise<void> {
    return this.command(
      { catalogue: CATALOGUE.ANALOGUE, crud: CRUD.UPSERT },
      data,
    );
  }

  get_analogue(data: Partial<Material_No>): Promise<Mat_No_Analog[] | []> {
    return this.command(
      { catalogue: CATALOGUE.ANALOGUE, crud: CRUD.GET },
      data,
    );
  }
  analogue_full_update(data: Partial<Mat_No_Analog>): Promise<void> {
    return this.command(
      { catalogue: CATALOGUE.ANALOGUE, crud: CRUD.FULL_UPDATE },
      data,
    );
  }
  update_mat_no(data: Omit<Product_Mat_No, 'id'>): Promise<void> {
    return this.command(
      { catalogue: CATALOGUE.MATERIAL, crud: CRUD.UPSERT },
      data,
    );
  }
  set_sp_mat_no_as_product(data: Partial<Material_No>[]): Promise<void> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_MAT_NO,
        crud: CRUD.UPSERT,
      },
      data,
    );
  }
  upsert_product_types(data: Partial<Product_Type>[]): Promise<void> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_TYPE,
        crud: CRUD.FULL_UPDATE,
      },
      data,
    );
  }
  delete_product_types(data: Pick<Product_Type, 'code'>[]): Promise<void> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_TYPE,
        crud: CRUD.DELETE,
      },
      data,
    );
  }
  get_product_types(): Promise<Product_Type[]> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_TYPE,
        crud: CRUD.GET,
      },
      '',
    );
  }
  set_Product_data(
    data: Product_update,
  ): Promise<Pick<Product_update_result, 'error_List'>> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_MAT_NO,
        crud: CRUD.FULL_UPDATE,
      },
      data,
    );
  }
  get_Products(data: string): Promise<Product[] | []> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_MAT_NO,
        crud: CRUD.SEARCH,
      },
      data,
    );
  }
  get_Scheme_data(data: Product): Promise<Scheme_data | []> {
    return this.command(
      {
        catalogue: CATALOGUE.SCHEME,
        crud: CRUD.GET,
      },
      data,
    );
  }
  get_Product_Mat_nos(data: Product): Promise<Product_Mat_No[] | []> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_MAT_NO,
        crud: CRUD.UPSERT,
      },
      data,
    );
  }
  get_Product_Works(data: Product): Promise<Product_Work[] | []> {
    return this.command(
      {
        catalogue: CATALOGUE.PRODUCT_MAT_NO,
        crud: CRUD.GET,
      },
      data,
    );
  }

  work_full_update(data: Partial<Work>[]): Promise<void> {
    return this.command(
      {
        catalogue: CATALOGUE.WORK,
        crud: CRUD.FULL_UPDATE,
      },
      data,
    );
  }
  work_search(data: string): Promise<Work[] | []> {
    return this.command(
      {
        catalogue: CATALOGUE.WORK,
        crud: CRUD.SEARCH,
      },
      data,
    );
  }
  work_get(data: Partial<Work>): Promise<Work> {
    return this.command(
      {
        catalogue: CATALOGUE.WORK,
        crud: CRUD.GET,
      },
      data,
    );
  }
  work_part_update(data: Partial<Work>): Promise<void> {
    return this.command(
      {
        catalogue: CATALOGUE.WORK,
        crud: CRUD.UPSERT,
      },
      data,
    );
  }
}
