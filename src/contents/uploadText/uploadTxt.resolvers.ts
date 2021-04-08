import { json } from "express";
import { fieldToFieldConfig } from "graphql-tools";
import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
const resolvers = {
  Mutation: {
    uploadText: protectedResolver(
      async (_, { textTest, title, desc }, { loggedInUser }) => {
        if (!textTest) {
          return {
            ok: false,
            error: "there is no gameTitle",
          };
        }
        const manyA1 = textTest.map((aData) => ({
          body: aData.answer1,
        }));

        const manyA2 = textTest.map((aData) => ({
          body: aData.answer2,
        }));
        const manyA = manyA1.concat(manyA2);
        console.log(manyA);
        const manyQ = textTest.map((aData) => ({
          questionBody: aData.question,
          answer: {
            create: manyA,
          },
        }));

        // const manyQ = textTest.map((aData) => ({
        //   questionBody: aData.question,
        // }));
        // console.log(manyQ);

        //! question에는 어떻게 데이터 저장할지

        await client.content.create({
          data: {
            type: "textGame",
            title,
            desc,
            userId: loggedInUser.id,
            question: {
              create: manyQ,
            },
          },
        });

        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
