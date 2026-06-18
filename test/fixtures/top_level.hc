// top-level init
I64 global_count = 0;

U0 Bump()
{
  global_count = global_count + 1;
}

Bump;