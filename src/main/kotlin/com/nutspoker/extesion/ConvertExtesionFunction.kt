package com.nutspoker.extesion

import com.nutspoker.controller.request.PostParticipantRequest
import com.nutspoker.controller.request.PutBlindRequest
import com.nutspoker.controller.request.PutBreakRequest
import com.nutspoker.controller.request.PutParticipantRequest
import com.nutspoker.controller.response.BlindLoadResponse
import com.nutspoker.controller.response.ChampionResponse
import com.nutspoker.controller.response.ParticipantsShowResponse
import com.nutspoker.model.BlindModel
import com.nutspoker.model.ParticipantModel
import org.springframework.data.jpa.domain.AbstractPersistable_.id


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

// Request to Model
fun PostParticipantRequest.toParticipantModel(): ParticipantModel {
    return ParticipantModel(
        player = this.player,
    )
}

// Request to Model
fun PutParticipantRequest.toParticipantModel(previousParticipant: ParticipantModel): ParticipantModel {
    return ParticipantModel(
        id = previousParticipant.id,
        player = this.player ?: previousParticipant.player,
        buyIn = this.buyIn ?: previousParticipant.buyIn,
        quantityRebuy = this.quantityRebuy ?: previousParticipant.quantityRebuy,
        valueRebuy = this.valueRebuy ?: previousParticipant.valueRebuy,
        totalRebuy = previousParticipant.totalRebuy,
        addOn = this.addOn ?: previousParticipant.addOn,
        totalPlayer = previousParticipant.totalPlayer,
        payment = this.payment ?: previousParticipant.payment,
        position = this.position ?: previousParticipant.position,
        sessionId = previousParticipant.sessionId
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

//Model to Response
fun ParticipantModel.toParticipantsShowResponse(): ParticipantsShowResponse {
    return ParticipantsShowResponse(
        id = this.id!!,
        player = this.player,
        buyIn = this.buyIn,
        quantityRebuy = this.quantityRebuy,
        valueRebuy = this.valueRebuy,
        totalRebuy = this.totalRebuy,
        addOn = this.addOn,
        totalPlayer = this.totalPlayer,
        payment = this.payment,
        position = this.position,
    )
}

// Model to Response
fun ParticipantModel.toChampionResponse(): ChampionResponse {
    return ChampionResponse(
        player = this.player,
        position = this.position,
    )
}


