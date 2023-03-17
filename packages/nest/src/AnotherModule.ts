import { Module } from "./decorators/Module";
import { RequireModule } from "./RequireModule";

@Module({
    imports: [RequireModule],
})
export class AnotherModule {}
