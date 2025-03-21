import { prisma } from "../../db/connection";

export class Pagination
{
    public async paginate (page: number = 1, limit: number = 10, userId: number): Promise<object>
    {
        const skip: number = (page - 1) * limit;

        const totalForms = await prisma.form.count({
            where: {
                user_id: userId,
            }
        });

        const formsPaginate = await prisma.form.findMany({
            where: {
                user_id: userId,
            },
            take: limit,
            skip: skip,
            orderBy: {
                created_at: 'desc',
            }
        });

        const totalPage = Math.ceil(totalForms / limit);


        return {
            data: formsPaginate,
            currentPage: page,
            pageSize: limit,
            totalForms,
            totalPage,
            hasNextPage: page < totalPage,
            hasPrevPage: page > 1,
            nextPage: page < totalPage ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
    }
}