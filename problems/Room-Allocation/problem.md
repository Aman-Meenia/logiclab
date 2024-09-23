# Room Allocation

&nbsp;

#### There is a large hotel, and n customers will arrive soon. Each customer wants to have a single room.

#### You know each customer's arrival and departure day. Two customers can stay in the same room if the departure day of the first customer is earlier than the arrival day of the second customer.

#### What is the minimum number of rooms that are needed to accommodate all customers? And how can the rooms be allocated?

### Input:

#### The first input line contains an integer n: the number of customers. Then there are n lines, each of which describes one customer. Each line has two integers a and b: the arrival and departure day.

### Output

#### Print an integer k: the minimum number of rooms required.

&nbsp;

**Example 1:**

&nbsp;

**Input**

```
intervals = [[1,2],[2,4],[4,4]]
```

&nbsp;

**Output**

```
2
```

&nbsp;

**Example 2:**

&nbsp;

**Input**

```
intervals = [[1,2],[2,3],[3,4],[4,5]]
```

&nbsp;

**Output**

```
2
```

&nbsp;

### Constraints

&nbsp;

- 1 <= arr.length <= 10^5

  &nbsp;

- 1 <= arr[i][0], arr[i][1] <= 10^9

  &nbsp;
