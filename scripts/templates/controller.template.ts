export const generateControllerTemplate = (name: string): string =>
{
    return `import { Request, Response } from 'express';
import { Controller } from '../../scripts/templates/controller.interface';

class ${name} implements Controller<Response> {
    public index(req: Request, res: Response): Response {
        try {
            // logic here..

            return res.status(200).json({
                message: '${name} - Daftar data berhasil diambil',
                data: []
            });
        } catch (error) {
            return this.handleError(res, error, 'Gagal mengambil data');
        }
    }

    public create(req: Request, res: Response): Response {
        try {
            // logic here..

            return res.status(201).json({
                message: '${name} - Data berhasil dibuat',
                data: req.body
            });
        } catch (error) {
            return this.handleError(res, error, 'Gagal membuat data');
        }
    }

    public update(req: Request, res: Response): Response {
        try {
            const { id } = req.params;
            // Implementasi logika update

            return res.status(200).json({
                message: '${name} - Data berhasil diperbarui',
                data: { id, ...req.body }
            });
        } catch (error) {
            return this.handleError(res, error, 'Gagal memperbarui data');
        }
    }

    public delete(req: Request, res: Response): Response {
        try {
            const { id } = req.params;
            // logic here..

            return res.status(200).json({
                message: '${name} - Data berhasil dihapus',
                data: { id }
            });
        } catch (error) {
            return this.handleError(res, error, 'Gagal menghapus data');
        }
    }

    private handleError(res: Response, error: unknown, message: string): Response {
        console.error(error);
        return res.status(500).json({
            message,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export default new ${name};`
}