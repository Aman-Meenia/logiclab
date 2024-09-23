# Count Number Of Distinct Element In Range L To R

&nbsp;

#### In this problem we have given an array v[i] of size n and range array of size t which contains L and R. We have to find the number of distinct elements in the array in the range L to R.

#### L and R are 0 indexed and both L and R are inclusive.

&nbsp;

**Example 1:**

&nbsp;

**Input**

```
v = [1, 2, 3, 4, 5, 6]
```

&nbsp;

```
ranges = [[0, 2], [2, 4], [5, 5]]
```

&nbsp;

**Output**

```
[3,3,1]
```

&nbsp;

**Example 2:**

&nbsp;

**Input**

```
v = [4, 2, 3, 4, 4, 5, 6, 2, 3, 4]
```

&nbsp;

```
ranges = [[0,9],[2,8],[0,4]]
```

&nbsp;

**Output**

```
[5,5,3]
```

&nbsp;

### Constraints

&nbsp;

- 1 <= v.length <= 10^5

  &nbsp;

- 0 <= v[i] <= 10^5

  &nbsp;

- 1 <= ranges.length <= 10^5

  &nbsp;

- ranges[i].length ==2

  &nbsp;

- 0 <= ranges[i] <= v.length-1

  &nbsp;
