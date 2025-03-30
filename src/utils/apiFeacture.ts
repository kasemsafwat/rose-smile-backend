import { Types, PipelineStage } from "mongoose";

export function paginate(page: number, size: number) {
  if (size > 23) {
    size = 23;
  }
  page = page && page > 0 ? page : 1;
  size = size && size > 0 ? size : 10;
  const skip = (page - 1) * size;
  return { limit: size, skip };
}

export type MatchParams = {
  fields: string[];
  search?: string | null;
  op: "$or" | "$and";
};

export type LookupParams = {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  isArray?: boolean;
  searchFields?: string[];
  searchTerm?: string;
};

export type ProjectionParams = {
  allowFields: string[];
  select?: string;
  defaultFields: string[];
};

export type MatchIdParams = {
  Id: Types.ObjectId | string;
  field: string;
};

export default class ApiPipeline {
  private pipeline: PipelineStage[];

  constructor() {
    this.pipeline = [];
  }

  match(params: MatchParams): this {
    const { fields, search, op } = params;
    if (!search || search == "") return this;
    const searchQuery = fields.map((field: string) => ({
      [field]: { $regex: search, $options: "i" },
    }));
    this.pipeline.push({ $match: { [op]: searchQuery } });
    return this;
  }

  sort(sortText?: string): this {
    if (!sortText) return this;
    const sortFields: Record<string, 1 | -1> = {};
    sortText.split(",").forEach((item) => {
      const [field, order] = item.split(":");
      sortFields[field.trim()] = order.trim().toLowerCase() === "desc" ? -1 : 1;
    });
    this.pipeline.push({ $sort: sortFields });
    return this;
  }

  matchId(params: MatchIdParams): this {
    const { Id, field } = params;
    if (!Id || !Types.ObjectId.isValid(Id)) {
      throw new Error("Invalid ObjectId");
    }
    this.pipeline.push({ $match: { [field]: new Types.ObjectId(Id) } });
    return this;
  }

  searchOnString(field: string, searchValue: string): ApiPipeline {
    if (!searchValue || !field) {
      return this;
    }
    console.log(searchValue);

    this.addStage({
      $match: {
        [field]: { $regex: searchValue, $options: "i" },
      },
    });
    return this;
  }

  lookUp(params: LookupParams, projectFields?: object): this {
    const lookupStage: any = {
      from: params.from,
      localField: params.localField,
      foreignField: params.foreignField,
      as: params.as,
    };

    if (params.searchFields && params.searchTerm) {
      const searchConditions = params.searchFields.map((field) => ({
        [field]: { $regex: params.searchTerm, $options: "i" },
      }));
      lookupStage.pipeline = [{ $match: { $or: searchConditions } }];
    }

    if (projectFields) {
      lookupStage.pipeline = lookupStage.pipeline || [];
      lookupStage.pipeline.push({ $project: projectFields });
    }

    this.pipeline.push({ $lookup: lookupStage });

    if (!params.isArray) {
      this.pipeline.push({
        $unwind: {
          path: `$${params.as}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }

    return this;
  }

  projection(params: ProjectionParams): this {
    const { allowFields, select, defaultFields } = params;
    const selectedFields = select
      ? select.split(",").map((f) => f.trim())
      : defaultFields;
    const fieldWanted = selectedFields.filter((field) =>
      allowFields.includes(field)
    );

    if (fieldWanted.length > 0) {
      const projection = fieldWanted.reduce<Record<string, 1>>((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});

      this.pipeline.push({ $project: projection });
    }

    return this;
  }

  paginate(page: number, size: number): this {
    const { limit, skip } = paginate(page, size);
    this.pipeline.push({ $skip: skip });
    this.pipeline.push({ $limit: limit });
    return this;
  }

  addStage(stage: PipelineStage): this {
    if (typeof stage !== "object" || Array.isArray(stage)) {
      throw new Error("Stage must be a valid object");
    }
    this.pipeline.push(stage);
    return this;
  }

  build(): PipelineStage[] {
    return this.pipeline;
  }
}
