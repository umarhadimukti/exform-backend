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
                nextPage: [],
                prevPage: [],
            };
        }

        // skip (eg. (page = 2 - 1) * limit = 5 --> result: 5) ==> start with index 5 (position 6)
        const skip: number = (data.page - 1) * data.limit;

        // find total the data
        const totalData: number = await findTotal();

        // calculate total page (formula: total data / limit per page) ==> 23 / 5 = 5
        const totalPage = Math.ceil(totalData / data.limit);

        // retrieved paginate data
        const paginatedData = await findPaginate(skip, data.limit)

        // init prev, next
        let prevPages: number[] = [];
        let nextPages: number[] = [];

        for (let startPrev = Math.max(1, data.page - 2); startPrev < data.page; startPrev++) {
            prevPages.push(startPrev);
        }
        for (let startNext = data.page + 1; startNext <= Math.min(totalPage, data.page + 2); startNext++) {
            nextPages.push(startNext);
        }

        return {
            data: paginatedData,
            currentPage: data.page,
            pageSize: data.limit,
            totalData,
            totalPage,
            hasNextPage: data.page < totalPage,
            hasPrevPage: data.page > 1,
            nextPage: nextPages,
            prevPage: prevPages,
        };
    }
}