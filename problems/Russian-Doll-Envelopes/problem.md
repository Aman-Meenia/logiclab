# Russian Doll Envelopes

&nbsp;

#### You are given a 2D array of integers envelopes where envelopes[i] = [wi, hi] represents the width and the height of an envelope.

#### One envelope can fit into another if and only if both the width and height of one envelope are greater than the other envelope's width and height.

#### Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).

#### Note: You cannot rotate an envelope.

&nbsp;

**Example 1:**

&nbsp;

**Input**

```
envelopes = [[5,4],[6,4],[6,7],[2,3]]
```

&nbsp;

**Output**

```
3
```

&nbsp;

**Example 2:**

&nbsp;

**Input**

```
envelopes = [[1,1],[1,1],[1,1]]
```

&nbsp;

**Output**

```
1
```

&nbsp;
**Example 3:**

&nbsp;

**Input**

```
arr = [3, 3] target = 6
```

&nbsp;

**Output**

```
[0, 1]
```

&nbsp;

### Constraints

&nbsp;

- 1 <= envelopes.length <= 10^5

  &nbsp;

- envelopes[i].length == 2

  &nbsp;

- 1 <= wi, hi <= 10^5
