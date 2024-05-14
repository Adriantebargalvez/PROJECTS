package com.kreitefy.specs;




import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.specs.shared.EntitySpecification;
import com.kreitefy.specs.shared.SearchCriteria;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ItemSpecification extends EntitySpecification<Canciones> implements Specification<Canciones> {


    public ItemSpecification(List<SearchCriteria> criteria) {
        this.criteria = criteria;
    }



}
