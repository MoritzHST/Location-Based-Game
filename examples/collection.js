/**
 * 
 * @param err
 * @param collectionList
 * @returns
 */
operations.getCollection(null, function (err, collectionList) {
    if (!err)
        logging.Info(collectionList);
    else
        logging.Error(err);
});