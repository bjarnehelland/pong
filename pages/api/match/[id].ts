import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "utils/mongodb";

export default async function matches(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const id = req.query.id as string;
  switch (req.method) {
    case "GET":
      const getData = await db.collection("matches").findOne({ _id: id });
      res.send(getData);
      break;
    case "PUT":
      const updateData = await db
        .collection("matches")
        .updateOne({ _id: id }, { $set: req.body });
      res.send(updateData);
      break;
  }
}
