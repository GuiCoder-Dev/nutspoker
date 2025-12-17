package com.nutspoker.extesion

import com.nutspoker.controller.request.PutBlindRequest
import com.nutspoker.controller.request.PutBreakRequest
import com.nutspoker.controller.response.BlindLoadResponse
import com.nutspoker.model.BlindModel



// Request to Model
fun PutBlindRequest.toBlindModel(previousBlind: BlindModel): BlindModel{
    return BlindModel(
        id = previousBlind.id,
        level = previousBlind.level,
        smallBlind = this.smallBlind ?: previousBlind.smallBlind,
        bigBlind = this.bigBlind ?: previousBlind.bigBlind,
        ante = this.ante ?: previousBlind.ante,
        duration = this.duration ?: previousBlind.duration,
        sessionId = previousBlind.sessionId
    )
}

// Request to Model
fun PutBreakRequest.toBlindModel(previousBlind: BlindModel): BlindModel{
    return BlindModel(
        id = previousBlind.id,
        level = previousBlind.level,
        smallBlind = previousBlind.smallBlind,
        bigBlind = previousBlind.bigBlind,
        ante = previousBlind.ante,
        duration = this.duration ?: previousBlind.duration,
        sessionId = previousBlind.sessionId
    )
}


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



