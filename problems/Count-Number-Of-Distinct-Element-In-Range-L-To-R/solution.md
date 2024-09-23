```cpp
/*
 Author: Aman Meenia
 Created: Mon Sep 23 17:55:43 IST 2024
 */
#include <bits/stdc++.h>
#define ll long long
#define mod 1000000007
using namespace std;

#define mid (l + (r - l) / 2)

struct node {
  int cnt;
  node() { cnt = 0; }
};

// Declare

// merge
node merge(node a, node b) {
  node ans;

  ans.cnt = a.cnt + b.cnt;
  return ans;
}

// update

void update(int index, int l, int r, int lq, int rq, node *t) {
  if (lq > r || rq < l) {
    return;
  }

  if (lq <= l && rq >= r) {

    t[index].cnt = 1;
    return;
  }

  update(2 * index, l, mid, lq, rq, t);
  update(2 * index + 1, mid + 1, r, lq, rq, t);

  t[index] = merge(t[2 * index], t[2 * index + 1]);
}

// get query

node get_query(int index, int l, int r, int lq, int rq, node *t) {

  if (lq > r || rq < l)
    return node();

  if (lq <= l && rq >= r) {
    return t[index];
  }

  node ans1 = get_query(2 * index, l, mid, lq, rq, t);
  node ans2 = get_query(2 * index + 1, mid + 1, r, lq, rq, t);

  return merge(ans1, ans2);
}

#undef mid

static int cmp(vector<int> &a, vector<int> &b) { return a[2] < b[2]; }

vector<int> distinctElements(vector<int> v, vector<vector<int>> q) {
  int n = v.size();
  int m = q.size();
  node t[4 * 200100];

  vector<vector<int>> temp;
  for (int i = 0; i < m; i++) {
    int l, r, k;
    l = q[i][0];
    r = q[i][1];
    k = l - 1;
    temp.push_back({l, r, k, i});
  }

  // for(auto it:q){
  //    cout<<it[0]<<" # "<<it[1]<<" # "<<it[2]<<" # "<<it[3]<<endl;
  // }

  vector<vector<int>> dp;
  map<int, int> mp;

  for (int i = 0; i < v.size(); i++) {
    if (mp.find(v[i]) != mp.end()) {
      dp.push_back({mp[v[i]], i});
    } else {
      dp.push_back({-1, i});
    }
    mp[v[i]] = i;
  }

  sort(dp.begin(), dp.end());
  sort(temp.begin(), temp.end(), cmp);
  //   for (auto it : dp) {
  //     cout << it[0] << " # " << it[1] << endl;
  //   }
  // cout << endl;

  // Now we find the number of element less than K

  int index = 0;
  vector<int> ANS(m);
  for (int i = 0; i < m; i++) {

    int l = temp[i][0];
    int r = temp[i][1];
    int k = temp[i][2];
    int idx = temp[i][3];

    while (index < n && dp[index][0] <= k) {
      int indexis = dp[index][1];
      //   cout << "  Update      " << endl;
      update(1, 0, n - 1, indexis, indexis, t);
      index++;
    }

    node ans = get_query(1, 0, n - 1, l, r, t);

    ANS[idx] = ans.cnt;
    // cout << " ANS " << ans.cnt << endl;
  }

  return ANS;
}

void Function() {

  int n, m, m1;
  cin >> n;

  vector<int> v(n);
  for (int i = 0; i < n; i++) {
    cin >> v[i];
  }
  cin >> m >> m1;
  vector<vector<int>> t;
  for (int i = 0; i < m; i++) {
    int a, b;
    cin >> a >> b;
    t.push_back({a, b});
  }

  // for (auto it : v)
  //   cout << it << " ";
  // cout << endl;
  // for (auto it : t) {
  //   for (auto a : it) {
  //     cout << a << " ";
  //   }
  //   cout << endl;
  // }
  // cout << endl;

  vector<int> ans = distinctElements(v, t);
  for (auto it : ans)
    cout << it << " ";

  cout << endl;
}

int main() {

  int t = 1;

  while (t--) {
    Function();
  }
}


```
