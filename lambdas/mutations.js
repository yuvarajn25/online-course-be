import functionRegistry from "../mutations/functions-registry";

async function invokeHandler(event, registry, isMainHandler) {
  console.log(`Invoke handler`, registry);
  const result = await registry.mutationHandler(event);
  if (isMainHandler) event.returnValue = result;
  else event.prevResult = result;
  const postMutationHandler =
    registry.postMutationHandler &&
    functionRegistry.find((f) => f.name === registry.postMutationHandler);
  if (postMutationHandler) {
    return invokeHandler(event, postMutationHandler);
  }
  return;
}

module.exports.handler = async (event, context, callback) => {
  try {
    console.log(`EVENT:: `, JSON.stringify(event, 0, 2));
    const { mutationName, args, user } = event;
    const handler = functionRegistry.find((f) => f.name === mutationName);
    if (handler) {
      await invokeHandler(event, handler, true);
    }
    callback(null, event.returnValue);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
