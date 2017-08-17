export const endpointComparator = (a, b) => {
    let sortOrderComparisonResult: number;
    let operationComparisonResult: number;
    let nameComparisonResult: number = a.name.localeCompare(b.name);

    if (a.metadata.sortOrder != null && b.metadata.sortOrder != null) {
        sortOrderComparisonResult = a.metadata.sortOrder.localeCompare(b.metadata.sortOrder);
    }

    if (a.metadata.operation != null && b.metadata.operation != null) {
        operationComparisonResult = a.metadata.operation.localeCompare(b.metadata.operation);
    }

    if (sortOrderComparisonResult != null && sortOrderComparisonResult !== 0) {
        return sortOrderComparisonResult;
    }
    else if (operationComparisonResult != null && operationComparisonResult !== 0) {
        return operationComparisonResult;
    }
    else {
        return nameComparisonResult;
    }
}