package com.nutspoker.controller.response

import com.fasterxml.jackson.annotation.JsonAlias
import com.nutspoker.enuns.Payment
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import java.math.BigDecimal

data class ParticipantsShowResponse(
    @JsonAlias("player")
    val player: String,

    @JsonAlias("buy_in")
    val buyIn: BigDecimal,

    @JsonAlias("quantity_rebuy")
    val quantityRebuy: Int,

    @JsonAlias("value_rebuy")
    val valueRebuy: BigDecimal,

    @JsonAlias("total_rebuy")
    val totalRebuy: BigDecimal? = null,

    @JsonAlias("add_on")
    val addOn: BigDecimal,

    @JsonAlias("total_player")
    val totalPlayer: BigDecimal? = null,

    @JsonAlias("payment")
    @Enumerated(EnumType.STRING)
    val payment: Payment,

    @JsonAlias("position")
    val position: Int,
)
