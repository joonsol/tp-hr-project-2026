package com.tphr.hr.employmenttype.service;

import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.employmenttype.dto.EmploymentTypeRequest;
import com.tphr.hr.employmenttype.dto.EmploymentTypeResponse;
import com.tphr.hr.employmenttype.entity.EmploymentType;
import com.tphr.hr.employmenttype.repository.EmploymentTypeRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmploymentTypeService {

    private final EmploymentTypeRepository employmentTypeRepository;

    public List<EmploymentTypeResponse> findAll() {
        return employmentTypeRepository.findAll().stream().map(EmploymentTypeResponse::from).toList();
    }

    public EmploymentTypeResponse getById(Long employmentTypeId) {
        return EmploymentTypeResponse.from(findActive(employmentTypeId));
    }

    @Transactional
    public EmploymentTypeResponse create(EmploymentTypeRequest request) {
        EmploymentType employmentType = new EmploymentType(request.employmentTypeName());
        return EmploymentTypeResponse.from(employmentTypeRepository.save(employmentType));
    }

    @Transactional
    public EmploymentTypeResponse update(Long employmentTypeId, EmploymentTypeRequest request) {
        EmploymentType employmentType = findActive(employmentTypeId);
        employmentType.update(request.employmentTypeName());
        return EmploymentTypeResponse.from(employmentType);
    }

    @Transactional
    public void delete(Long employmentTypeId) {
        findActive(employmentTypeId).markDeleted();
    }

    private EmploymentType findActive(Long employmentTypeId) {
        return employmentTypeRepository.findById(employmentTypeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYMENT_TYPE_NOT_FOUND));
    }
}
