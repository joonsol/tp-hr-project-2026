package com.tphr.hr.position.dto;

import com.tphr.hr.position.entity.Position;

public record PositionResponse(
        Long positionId,
        String positionName,
        Integer level
) {

    public static PositionResponse from(Position position) {
        return new PositionResponse(position.getPositionId(), position.getPositionName(), position.getLevel());
    }
}
