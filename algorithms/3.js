/*
    # **문제 3 — 두 배열의 교집합**

    ## **문제 설명**

    정수 배열 nums1과 nums2가 주어질 때,

    두 배열의 **교집합**을 반환하세요.

    - 결과에는 중복이 없어야 합니다.
    - 결과의 순서는 상관없습니다.

*/

function solution(nums1, nums2) {
  return nums1.filter(num => nums2.includes(num));
}

solution([1,2,2,1], [2,2])      // [2]
solution([4,9,5], [9,4,9,8,4])  // [4,9]