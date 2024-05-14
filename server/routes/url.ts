import express from "express";
import authMiddleWare from "../middleware/authentication";
const router = express.Router();

import {
  getAllLinks,
  editLink,
  redirectUrl,
  createLink,
  createLinkWithoutLogin,
  deleteLink,
  reportLink,
  deleteAllLinks,
} from "../controllers/url";
import paginate from "../middleware/paginator";

router.get("/all", authMiddleWare, paginate, getAllLinks);
router.post("/create", authMiddleWare, createLink);
// a route that creates a short URL with or without login
router.post(
  "/create-without-login",
  createLinkWithoutLogin,
  authMiddleWare,
  createLink,
);
router.delete("/delete-all", authMiddleWare, deleteAllLinks);
router.delete("/delete/:id", authMiddleWare, deleteLink);
router.put("/edit/:id", authMiddleWare, editLink);
router.post("/report/:shortUrl", authMiddleWare, reportLink);
router.get("/:shortUrl", redirectUrl);

export default router;
