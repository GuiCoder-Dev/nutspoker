package com.nutspoker.service

import com.nutspoker.model.BlindModel
import com.nutspoker.repository.BlindRepository
import org.springframework.stereotype.Service

@Service
class BlindService(
    private val blindRepository: BlindRepository
) {

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
        )

        val savedBlind = blindRepository.save(newBlind)
        return savedBlind
    }

}