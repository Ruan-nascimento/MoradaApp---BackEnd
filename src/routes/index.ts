import { Router } from 'express';
import { loginController } from '../controllers/login.controller';
import { cadastroController } from '../controllers/cadastro.controller';
import { getAllDataController } from '../controllers/getAllData.controller';
import { createReservationController } from '../controllers/createReservation.controller';
import { listarReservasController } from '../controllers/listarReservas.controller';
import { cancelarReservaController } from '../controllers/cancelarReserva.controller';
import { authMiddleware } from '../middlewares/auth';
import { meController } from '../controllers/me.controller';

const router = Router();

// vai retornar os dados do usuário logado
router.get('/me', authMiddleware, meController)

// vai enviar email e senha para ser verificado no banco de dados e retornar token de acesso
router.post('/login', loginController)

// vai receber os dados do formulario de cadastro e cadastrar no banco de dados
router.post('/cadastro', cadastroController)

// vai retornar todos os dados mockados do banco de dados para o frontend
router.get('/get-all-data', authMiddleware, getAllDataController)

// vai pegar os dados da reserva selecionada e salvar no banco de dados como uma reserva do usuário
router.post('/criar-reserva', authMiddleware, createReservationController)

// vai buscar no banco de dados todas as reservas feitas pelo usuário logado 
router.post('/listar-reservas', authMiddleware, listarReservasController)

// vai receber o id da reserva e deletar ela do banco de dados
router.delete('/cancelar-reserva', authMiddleware, cancelarReservaController)



export default router;
