import { Router } from 'express';
import { loginController } from '../controllers/login.controller';
import { cadastroController } from '../controllers/cadastro.controller';
import { getAllDataController } from '../controllers/getAllData.controller';
import { createReservationController } from '../controllers/createReservation.controller';
import { confirmReservationController } from '../controllers/confirmReservation.controller';
import { listarReservasController } from '../controllers/listarReservas.controller';
import { cancelarReservaController } from '../controllers/cancelarReserva.controller';
import { adicionarFavoritoController } from '../controllers/adicionarFavorito.controller';
import { removerFavoritoController } from '../controllers/removerFavorito.controller';
import { listarFavoritosController } from '../controllers/listarFavoritos.controller';
import { authMiddleware } from '../middlewares/auth';
import { meController } from '../controllers/me.controller';
import { listImoveisController } from '../controllers/listImoveis.controller';
import { getImovelByIdController } from '../controllers/getImovelById.controller';
import { updatePhotoController } from '../controllers/updatePhoto.controller';

const router = Router();

router.get('/me', authMiddleware, meController)
router.post('/login', loginController)
router.post('/cadastro', cadastroController)
router.get('/get-all-data', authMiddleware, getAllDataController)
router.post('/criar-reserva', authMiddleware, createReservationController)
router.post('/confirmar-reserva', authMiddleware, confirmReservationController)
router.post('/listar-reservas', authMiddleware, listarReservasController)
router.delete('/cancelar-reserva', authMiddleware, cancelarReservaController)
router.post('/adicionar-favorito', authMiddleware, adicionarFavoritoController)
router.delete('/remover-favorito', authMiddleware, removerFavoritoController)
router.get('/favoritos', authMiddleware, listarFavoritosController)
router.get('/imoveis', listImoveisController)
router.get('/imoveis/:id', getImovelByIdController)
router.post('/update-photo', authMiddleware, updatePhotoController)

export default router;

