/*
    # **문제 3 — 두 배열의 교집합**

    ## **문제 설명**

    정수 배열 nums1과 nums2가 주어질 때,

    두 배열의 **교집합**을 반환하세요.

    - 결과에는 중복이 없어야 합니다.
    - 결과의 순서는 상관없습니다.

*/

/*
    문제 풀이 방식 설명
    1. Set을 사용하여 문제를 해결했습니다.
    2. javascript집합 연산자를 검색하여 교집합을 구하는 intersection을 발견하여 간단하게 문제를 해결했습니다.
*/

function solution(nums1, nums2) {
    const set1 = new Set(nums1);
    const set2 = new Set(nums2);
    return Array.from(set1.intersection(set2));
}

console.log(solution([1,2,2,1], [2,2]))        // [2]
console.log(solution([4,9,5], [9,4,9,8,4]))    // [4,9]