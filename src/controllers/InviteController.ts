import { Request, Response } from 'express';
import { Controller } from '../../scripts/templates/controller.template';

            class InviteControllerController implements Controller {
                public index(req: Request, res: Response): Response {
                    try {
                        // logic here..

                       return res.status(200).json({
                            message: 'InviteController - Daftar data berhasil diambil',
                            data: []
                        });
                    } catch (error) {
                        return this.handleError(res, error, 'Gagal mengambil data');
                        // return res.status(400).json()
                    }
                }

                public create(req: Request, res: Response): Response {
                    try {
                        // logic here..

                        res.status(201).json({
                            message: 'InviteController - Data berhasil dibuat',
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
                            message: 'InviteController - Data berhasil diperbarui',
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
                            message: 'InviteController - Data berhasil dihapus',
                            data: { id }
                        });
                    } catch (error) {
                        this.handleError(res, error, 'Gagal menghapus data');
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

            export default new InviteController;