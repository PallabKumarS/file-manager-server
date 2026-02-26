import pick from './pick';

type IOptions = {
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const paginationHelper = (query: Record<string, unknown>): IOptionsResult => {
  const options = pick(query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]) as IOptions;

  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;

  const sortBy: string = options.sortBy ?? 'createdAt';
  const sortOrder: string = options.sortOrder ?? 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationHelper;
