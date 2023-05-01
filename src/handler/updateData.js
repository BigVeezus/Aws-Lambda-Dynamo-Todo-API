"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTodo = (event, context, callback) => {
  const datetime = new Date().toISOString();
  const data = JSON.parse(event.body);
  const params = {
    TableName: "myTable",
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ":t": data.task,
      ":d": data.done,
      ":u": datetime,
    },
    UpdateExpression: "set task = :t, done = :d, updatedAt = :u",
  };
  dynamoDb.update(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
    callback(null, response);
  });
};
