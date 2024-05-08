package com.kreitek.rrhh.usuarios.specs;



import com.kreitek.rrhh.usuarios.domain.Usuario;
import com.kreitek.rrhh.usuarios.specs.shared.EntitySpecification;
import com.kreitek.rrhh.usuarios.specs.shared.SearchCriteria;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ItemSpecification extends EntitySpecification<Usuario> implements Specification<Usuario> {


    public ItemSpecification(List<SearchCriteria> criteria) {
        this.criteria = criteria;
    }



}
