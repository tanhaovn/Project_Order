# Hng dn ci ttttttt Clerk

## Bc 1: Ly Clerk Publishable Key

1. Truy c: https://dashboard.clerk.com
#2. ng nh hoccccccc to ti kho
n mi (min ph
3. To mechot Application mi hoccccccc chn application hin c
4. Vo **API Keys** trong menu bn tri
5. Copy **Publishable Key** (key bt u bng `pk_test_...` hoccccccc `pk_live_...`)

## Bc 2: Cu hnh trong d n

1. M file `.env` trong thmc gc d n
2. Thay th gi tr ca `VITE_CLERK_PUBLISHABLE_KEY` bng key bn va copy:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_abc123xyz...
```

3. L file v restart dev server:
```bash
npm run dev
```

## L 

#- **KHNG** commit file `.env` ln Git (
# 
c thm vo .gitignore)
- File `.env.example` l template, khnnnng cha key th
- Key bt u bg developmentng `pk_test_` l cho miiii tr
- Key bt u bg productionng `pk_live_` l cho miiii tr

## Kim tra

#Sau khi cu hnh xong, m trnh duyt v truy c ng dng. Nu khnnnng cnn li v publishableKey th 
 thnh cnnnng!
