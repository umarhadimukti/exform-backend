export class Pagination<M>
{
    public async paginate (
        model: M[],
        findTotal: () => Promise<number>,
        findPaginate: (skip: number, take: number) => Promise<M[]>,
        data: { page: number, limit: number }
    ): Promise<object>
    {

        if (model.length === 0) {
            return {
                data: [],
                currentPage: null,
                pageSize: null,
                totalData: null,
                totalPage: null,
                hasNextPage: null,
                hasPrevPage: null,
                nextPage: null,
                prevPage: null,
            };
        }

        // skip (eg. (page = 2 - 1) * limit = 5 --> result: 5) ==> start with position 5
        const skip: number = (data.page - 1) * data.limit;

        // find total the data
        const totalData: number = await findTotal();

        // calculate total page (formula: total data / limit per page) ==> 23 / 5 = 5
        const totalPage = Math.ceil(totalData / data.limit);

        // retrieved paginate data
        const paginatedData = await findPaginate(skip, data.limit)

        console.log(paginatedData)

        return {
            data: paginatedData,
            currentPage: data.page,
            pageSize: data.limit,
            totalData,
            totalPage,
            hasNextPage: data.page < totalPage,
            hasPrevPage: data.page > 1,
            nextPage: data.page < totalPage ? data.page + 1 : null,
            prevPage: data.page > 1 ? data.page - 1 : null,
        };
    }
}