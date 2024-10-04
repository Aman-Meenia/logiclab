# Period Of String

&nbsp;

#### A period of a string is a prefix that can be used to generate the whole string by repeating the prefix. The last repetition may be partial. For example, the periods of abcabca are abc, abcabc and abcabca.

#### Your task is to return the minimum length period of the string s.

#### Last repetition of substring may be partial.

&nbsp;

**Example 1:**

&nbsp;

**Input**

```
s = "aaaaaaaaaa"
```

&nbsp;

**Output**

```
1
```

&nbsp;

**Example 2:**

&nbsp;

**Input**

```
s = "aabababaaa"
```

&nbsp;

**Output**

```
8
```

&nbsp;

**Example 3:**

&nbsp;

**Input**

```
s = "ahtqqkhrrn"
```

&nbsp;

**Output**

```
10
```

&nbsp;

### Constraints

&nbsp;

- 1 <= s.length <= 10^6

&nbsp;

- s[i] consists of lowercase English letters.

&nbsp;
