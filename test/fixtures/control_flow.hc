I32 Counter(I64 limit)
{
  I64 i = 0;
  while (i < limit) {
    i = i + 1;
  }
  if (i == limit) {
    return 1;
  } else {
    return 0;
  }
}