package com.tphr.hr.position.service;

import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.position.dto.PositionRequest;
import com.tphr.hr.position.dto.PositionResponse;
import com.tphr.hr.position.entity.Position;
import com.tphr.hr.position.repository.PositionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PositionService {

    private final PositionRepository positionRepository;

    public List<PositionResponse> findAll() {
        return positionRepository.findAll().stream().map(PositionResponse::from).toList();
    }

    public PositionResponse getById(Long positionId) {
        return PositionResponse.from(findActive(positionId));
    }

    @Transactional
    public PositionResponse create(PositionRequest request) {
        Position position = new Position(request.positionName(), request.level());
        return PositionResponse.from(positionRepository.save(position));
    }

    @Transactional
    public PositionResponse update(Long positionId, PositionRequest request) {
        Position position = findActive(positionId);
        position.update(request.positionName(), request.level());
        return PositionResponse.from(position);
    }

    @Transactional
    public void delete(Long positionId) {
        findActive(positionId).markDeleted();
    }

    private Position findActive(Long positionId) {
        return positionRepository.findById(positionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POSITION_NOT_FOUND));
    }
}
