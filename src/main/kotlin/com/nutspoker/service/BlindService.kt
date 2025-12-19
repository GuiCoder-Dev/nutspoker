package com.nutspoker.service

import com.nutspoker.model.BlindModel
import com.nutspoker.repository.BlindRepository
import org.springframework.stereotype.Service

@Service
class BlindService(
    private val blindRepository: BlindRepository,
) {

    // Post
    fun newBlind(): BlindModel {
        val lastBlind = blindRepository.findTopByOrderByLevelDesc()

        val newLevel = lastBlind.level + 1
        val newSmallBlind = lastBlind.smallBlind * 2
        val newBigBlind = lastBlind.bigBlind * 2
        val newAnte = lastBlind.ante
        val newDuration = lastBlind.duration

        val newBlind = BlindModel(
            level = newLevel,
            smallBlind = newSmallBlind,
            bigBlind = newBigBlind,
            ante = newAnte,
            duration = newDuration,
            sessionId = lastBlind.sessionId
        )

        val savedBlind = blindRepository.save(newBlind)
        return savedBlind
    }

    // Get
    fun blindsLoad(): List<BlindModel> {
        return blindRepository.findAll()
    }

    // Put
    fun update(blindUpdated: BlindModel) {
        if (blindUpdated.level > 0) {
            blindRepository.save(blindUpdated)
        } else {
            TODO()
        }
    }

    // Delete
    fun delete(blind: BlindModel) {
        if (blind.id != 1) {
            blindRepository.delete(blind)

            if (blind.level == 0) {
                return
            }

            val remainingBlinds = blindRepository.findAll()
            var levelCounter = 0

            remainingBlinds.forEach { blind ->
                if (blind.level > 0) {
                    levelCounter++
                    if (blind.level != levelCounter) {
                        blind.level = levelCounter
                        blindRepository.save(blind)
                    }
                }
            }
        } else {TODO()}
    }
}






























