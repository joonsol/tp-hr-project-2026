package com.tphr.hr.department.service;

import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.department.dto.DepartmentRequest;
import com.tphr.hr.department.dto.DepartmentResponse;
import com.tphr.hr.department.dto.DepartmentTreeNode;
import com.tphr.hr.department.entity.Department;
import com.tphr.hr.department.repository.DepartmentRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> findAll() {
        return departmentRepository.findAll().stream().map(DepartmentResponse::from).toList();
    }

    public DepartmentResponse getById(Long departmentId) {
        return DepartmentResponse.from(findActive(departmentId));
    }

    public List<DepartmentTreeNode> getTree() {
        List<Department> departments = departmentRepository.findAll();

        Map<Long, DepartmentTreeNode> nodesById = new HashMap<>();
        for (Department department : departments) {
            nodesById.put(department.getDepartmentId(),
                    DepartmentTreeNode.of(department.getDepartmentId(), department.getDepartmentName()));
        }

        List<DepartmentTreeNode> roots = new java.util.ArrayList<>();
        for (Department department : departments) {
            DepartmentTreeNode node = nodesById.get(department.getDepartmentId());
            Long parentId = department.getParentDepartmentId();
            if (parentId != null && nodesById.containsKey(parentId)) {
                nodesById.get(parentId).children().add(node);
            } else {
                roots.add(node);
            }
        }
        return roots;
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        Department department = new Department(request.departmentName(), request.parentDepartmentId());
        return DepartmentResponse.from(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponse update(Long departmentId, DepartmentRequest request) {
        Department department = findActive(departmentId);
        department.update(request.departmentName(), request.parentDepartmentId());
        return DepartmentResponse.from(department);
    }

    @Transactional
    public void delete(Long departmentId) {
        findActive(departmentId).markDeleted();
    }

    private Department findActive(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }
}
