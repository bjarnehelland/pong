import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "utils/mongodb";
import { nanoid } from "nanoid";

export default async function matches(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  switch (req.method) {
    case "POST":
      const createData = await db
        .collection("matches")
        .insertOne({
          _id: nanoid(12),
          ...req.body,
          createdAt: new Date().toDateString(),
        })
        .then(({ ops }) => ops[0]);
      console.log(createData);
      res.send(createData);
      break;
  }
}
