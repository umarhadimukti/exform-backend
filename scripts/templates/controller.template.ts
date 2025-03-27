import { Request, Response } from "express";

export interface Controller
{
    index(req: Request, res: Response): Response;
    show(req: Request, res: Response): Response;
    create(req: Request, res: Response): Response;
    put(req: Request, res: Response): Response;
    delete(req: Request, res: Response): Response;
}

export const generateControllerTemplate = (name: string): string =>
{
    return `import { Request, Response } from 'express';

            class ${name}Controller implements Controller {
                public index(req: Request, res: Response): Response {
                    try {
                        // logic here..

                        res.status(200).json({
                            message: '${name} - Daftar data berhasil diambil',
                            data: []
                        });
                    } catch (error) {
                        this.handleError(res, error, 'Gagal mengambil data');
                    }
                }

                public create(req: Request, res: Response): Response {
                    try {
                        // logic here..

                        res.status(201).json({
                            message: '${name} - Data berhasil dibuat',
                            data: req.body
                        });
                    } catch (error) {
                        this.handleError(res, error, 'Gagal membuat data');
                    }
                }

                public update(req: Request, res: Response): Response {
                    try {
                        const { id } = req.params;
                        // Implementasi logika update

                        res.status(200).json({
                            message: '${name} - Data berhasil diperbarui',
                            data: { id, ...req.body }
                        });
                    } catch (error) {
                        this.handleError(res, error, 'Gagal memperbarui data');
                    }
                }

                public delete(req: Request, res: Response): Response {
                    try {
                        const { id } = req.params;
                        // logic here..

                        res.status(200).json({
                            message: '${name} - Data berhasil dihapus',
                            data: { id }
                        });
                    } catch (error) {
                        this.handleError(res, error, 'Gagal menghapus data');
                    }
                }

                private handleError(res: Response, error: unknown, message: string): Response {
                    console.error(error);
                    res.status(500).json({
                        message,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            export default new ${name};`
}