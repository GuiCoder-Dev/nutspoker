package com.nutspoker.extesion

import com.nutspoker.controller.response.BlindLoadResponse
import com.nutspoker.model.BlindModel

// Model to Response
fun BlindModel.toBlindLoadResponse(): BlindLoadResponse{
    return BlindLoadResponse(
        level = this.level,
        smallBlind = smallBlind,
        bigBlind = this.bigBlind,
        ante = this.ante,
        duration = this.duration,
    )
}



