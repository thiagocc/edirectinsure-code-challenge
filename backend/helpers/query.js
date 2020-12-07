exports.getInfos = (total, query) => {
    const infos = {
        total: total,
        totalPages: Math.ceil(total / query.limit),
        limit: query.limit,
        currentPage: query.page,
        firstPage: 1,
        nextPage: query.page * query.limit < total ? query.page + 1 : null,
        previusPage: query.page > 1 ? query.page - 1 : null,
        lastPage: Math.ceil(total / query.limit),
    };

    return infos;
};

exports.setQueryInfos = (query, limit) => {
    query.limit = query.limit === 0 ? limit || 100 : query.limit;
    query.limit =
        query.limit > parseInt(process.env.MAX_LIMIT)
            ? parseInt(process.env.MAX_LIMIT)
            : query.limit;

    query.page =
        Math.ceil(query.skip / query.limit) === 0
            ? 1
            : Math.ceil(query.skip / query.limit);

    return query;
};
