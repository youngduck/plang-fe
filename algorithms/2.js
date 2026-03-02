/*
   # **문제 2 — 가장 긴 중복 없는 부분 문자열 길이**

    ## **문제 설명**

    문자열 s가 주어질 때,

    중복 문자가 없는 가장 긴 부분 문자열의 길이를 반환하세요.

*/

/*
    문제 풀이 방식 설명
    1. 그리디로 풀기보다는 시간복잡도를 줄이기 위해 슬라이딩 윈도우를 사용하여 문제를 해결했습니다.
    2. left와 right 포인터를 사용하여 문제를 해결했습니다.
    3. charSet을 사용하여 문제를 해결했습니다.
*/

function solution(s) {
    let left = 0;
    let right = 0;
    let maxLength = 0;
    let charSet = new Set();

    while (right < s.length) {
        if (!charSet.has(s[right])) {
            charSet.add(s[right]);
            right++;
        } else {
            charSet.delete(s[left]);
            left++;
        }
        maxLength = Math.max(maxLength, right - left);
    }
    return maxLength;
}

console.log(solution("abcabcbb"))   // 3 ("abc")
console.log(solution("bbbbb"))      // 1 ("b")
console.log(solution("pwwkew"))     // 3 ("wke")
console.log(solution(""))           // 0