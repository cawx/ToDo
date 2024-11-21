const postTaskSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        title: { type: "string" },
      },
      required: ["title"],
      additionalProperties: false,
    },
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

const putTaskSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
      },
      required: ["id", "title"],
      additionalProperties: false,
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

const deleteTaskSchema = {
  schema: {
    params: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: ["id"],
    },
  },
};

export default { postTaskSchema, putTaskSchema, deleteTaskSchema };
