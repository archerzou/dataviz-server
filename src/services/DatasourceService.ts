import { AppDataSource } from "@/database/config";
import { Datasource } from "@/entities/datasource.entity";import { IDataSource } from "@/interfaces/auth.interface";

import { IDataSourceDocument, IDataSourceProjectID } from "@/interfaces/datasource.interface";
import { decodeBase64 } from "@/utils/utils";
import { GraphQLError } from "graphql";

export class DatasourceService {
  static async createNewDataSource(data: IDataSourceDocument): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result = await datasourceRepository.save(data);
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSources(userid: string): Promise<IDataSource[]> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument[] = await datasourceRepository.find({
        where: { userId: userid },
        order: { createdAt: 'DESC' }
      }) as unknown as IDataSourceDocument[];
      const datasources: IDataSource[] = result.map((item) => {
        const { id, projectId, type, databaseName } = item;
        return {
          id,
          projectId,
          type,
          database: databaseName && databaseName.length > 0 ? decodeBase64(databaseName) : ''
        }
      }) as IDataSource[];
      return datasources;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }
}
