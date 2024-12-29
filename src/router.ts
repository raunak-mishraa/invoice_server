import { Router } from "express";
import { Login , Register } from "./Controllers/user";
import { createPDF  , downloadPDF} from "./Controllers/pdf";
import { verifyTokenMiddleware } from "./Middlewares/auth";


const router = Router();

router.post("/api/login",  Login);
router.post("/api/register",  Register);
router.post("/api/createpdf",verifyTokenMiddleware, createPDF);
router.post("/api/downloadpdf", verifyTokenMiddleware, downloadPDF);





export default router;
