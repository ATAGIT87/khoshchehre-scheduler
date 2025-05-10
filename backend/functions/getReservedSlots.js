const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "Reservations";

exports.handler = async (event) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      ProjectionExpression: "timeSlot"
    };

    const data = await dynamoDb.scan(params).promise();
    const reservedSlots = data.Items.map(item => item.timeSlot);

    return {
      statusCode: 200,
      body: JSON.stringify(reservedSlots)
    };

  } catch (error) {
    console.error("Error fetching reserved slots: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
