package com.nutspoker.service

import com.nutspoker.model.BlindModel
import com.nutspoker.repository.BlindRepository
import org.springframework.stereotype.Service

@Service
class BreakService(
    private val blindRepository: BlindRepository,
) {

    fun newBreak(): BlindModel{

        val newBlind = BlindModel(
            level = 0,
            smallBlind = 0,
            bigBlind = 0,
            ante = 0,
            duration = 8
        )

        val savedBlind = blindRepository.save(newBlind)
        return savedBlind
    }


}


