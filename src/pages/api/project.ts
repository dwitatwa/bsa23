import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/custom-script/prisma";

async function handleGetMethod(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const skip = typeof query.skip === "undefined" ? 0 : query.skip;

  try {
    const result = await prisma.project.findMany({
      take: 3,
      skip: Number(skip),
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
  }
}

async function handlePostMethod(req: NextApiRequest, res: NextApiResponse) {
  const dataFromClient = req.body;
  try {
    const result = await prisma.project.create({
      data: {
        name: dataFromClient.name,
        client: dataFromClient.client,
        deadline: dataFromClient.deadline,
        nilai: dataFromClient.nilai,
        progress: dataFromClient.progress,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data" });
  }
}

async function handlePutMethod(req: NextApiRequest, res: NextApiResponse) {
  const dataFromClient = req.body;
  try {
    const result = await prisma.project.update({
      data: {
        name: dataFromClient.name,
        client: dataFromClient.client,
        deadline: dataFromClient.deadline,
        nilai: dataFromClient.nilai,
        progress: dataFromClient.progress,
      },
      where: {
        id: dataFromClient.id,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data" });
  }
  console.log(dataFromClient);
}

async function handleDeleteMethod(req: NextApiRequest, res: NextApiResponse) {
  const projectId = req.query.id as string;
  try {
    const response = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus data" });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    handleGetMethod(req, res);
  }

  if (req.method === "POST") {
    handlePostMethod(req, res);
  }

  if (req.method === "PUT") {
    handlePutMethod(req, res);
  }

  if (req.method === "DELETE") {
    handleDeleteMethod(req, res);
  }
}
