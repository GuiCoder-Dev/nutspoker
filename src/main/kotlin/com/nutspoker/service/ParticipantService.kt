package com.nutspoker.service

import com.nutspoker.model.ParticipantModel
import com.nutspoker.repository.ParticipantRepository
import org.springframework.stereotype.Service

@Service
class ParticipantService(
    private val participantRepository: ParticipantRepository,
) {

    fun create(participant: ParticipantModel) {
        participantRepository.save(participant)
    }

    fun update(participant: ParticipantModel) {
        participantRepository.save(participant)
    }

    fun show(): List<ParticipantModel> {
        return participantRepository.findAll()
    }

    fun delete(participant: ParticipantModel) {
        participantRepository.delete(participant)
    }

    fun champion(sessionId: String): List<ParticipantModel> {
        return participantRepository.findBySessionIdAndPositionIn(sessionId, listOf( 1, 2, 3))
    }
}