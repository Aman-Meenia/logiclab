# Maximum Score From Removing Substrings

&nbsp;

#### You are given a string s and two integers x and y. You can perform two types of operations any number of times.

#### Remove substring "ab" and gain x points.

#### For example, when removing "ab" from "cabxbae" it becomes "cxbae".

#### Remove substring "ba" and gain y points.

#### For example, when removing "ba" from "cabxbae" it becomes "cabxe".

#### Return the maximum points you can gain after applying the above operations on s.

&nbsp;

**Example 1:**

&nbsp;

**Input**

```
s = "cdbcbbaaabab", x = 4, y = 5
```

&nbsp;

**Output**

```
19
```

&nbsp;

**Example 2:**

&nbsp;

**Input**

```
s = "aabbaaxybbaabb", x = 5, y = 4
```

&nbsp;

**Output**

```
20
```

&nbsp;

**Example 3:**

&nbsp;

**Input**

```
s = "bab", x = 1, y = 1
```

&nbsp;

**Output**

```
1
```

&nbsp;

### Constraints

&nbsp;

- 1 <= s.length <= 10^5

&nbsp;

1 <= x, y <= 10^5

&nbsp;

- s[i] consists of lowercase English letters.

&nbsp;
