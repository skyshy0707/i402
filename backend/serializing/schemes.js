const lessonView = {
    inclide: [
        "@all"
    ], 
    exclude: [
        '@pk',
        'content_data',
        'content_type',
        'created_at'
    ]
}

const lessonGetResponse = {
    include: [
        "@all"
    ],
    exclude: [
        '@pk',
        'created_at',
        'url'
    ]
}

const lessonCreateResponse = {
    include: [
        'id', 'url'
    ],
    as: {
        'id': 'lesson_id', 'url': 'lesson_url'
    }
}

const lessonUnpaidResponse = {
    include: [
        "@all"
    ],
    exclude: [
        '@pk',
        'content_data',
        'content_type',
        'created_at',
        'url'
    ]
}

const lessonUnpaidInfo = {
  token: "USDC",
  address: "CREATOR_WALLET",
  message: "x402 payment required"
}

const paginateResponseData = (total, limit=10, offset=0) => {
    return {
        offset: offset,
        limit: limit,
        total: total
    }
}

module.exports = {
    lessonView, 
    lessonCreateResponse, 
    lessonGetResponse, 
    lessonUnpaidResponse, 
    lessonUnpaidInfo,
    paginateResponseData
}